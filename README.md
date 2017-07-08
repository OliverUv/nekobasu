# nekobasu

Auto completion friendly library for configurable and type safe event buses with emitters that can buffer and reduce events!

This library lets you construct event buses. An event bus consists of a number of "nekos". A neko can receive an event of some type. It will then feed this event to each of its event buffers, which listeners can subscribe to. A buffer can dispatch, buffer, and reduce events.

You can build your own event buffers and nekos. The library also comes with some built in. Lets look at an example:

```typescript
import * as nbus from 'nekobasu';

let neko = nbus.builtin.event<number>();

neko.immediate.sub((n) => console.log(`immediate ${n}`));
neko.last.sub((n) => console.log(`last ${n}`));
neko.list.sub((n) => console.log(`list ${n}`));

neko.send(1); // immediate 1
neko.send(2); // immediate 2
neko.send(3); // immediate 3

neko.flush(); // last 3 and list [1, 2, 3]
```

TypeScript can infer all types used, so you get complete auto completion and the assurance that your event handlers know which arguments to expect. The list handler above knows it's getting a list of numbers, and the last handler knows it'll get a single number.

The event buffers all extend `SimpleEventDispatcher` from the [https://github.com/KeesCBakker/Strongly-Typed-Events-for-TypeScript](Strongly-Typed-Events-for-TypeScript) library.

You can just nekos if you want, they work fine by themselves. This is how you would create an event bus:

```typescript
let event_bus = nbus.event_bus.create({
  cool_numbers: nbus.builtin.event<number>(),
  boring_strings: nbus.builtin.event<string>(),
});

// Nekos can be used as you saw above
event_bus.cool_numbers.list.sub((n) => console.log(`list ${n}`));
event_bus.cool_numbers.immediate.sub((n) => console.log(`imm ${n}`));

event_bus.cool_numbers.send(2333); // imm 2333

// Clearing removes all buffered events
event_bus._meta.clear();

event_bus.cool_numbers.flush(); // no "list [2333]", since we cleared

// You can also flush all nekos using the event bus
event_bus._meta.flush();

// And clear individual nekos
event_bus.cool_numbers._meta.clear();
```

So in essence, using the event bus simply gives you the clear and flush convenience functions. You can also combine multiple event buses if you want to namespace your app's events:

```typescript
let event_bus = nbus.event_bus.categorized({

  cool: nbus.event_bus.create({
    numbers: nbus.builtin.event<number>(),
    strings: nbus.builtin.event<string>(),
  }),

  bad: nbus.event_bus.create({
    errors: nbus.builtin.event<Error>(),
    feels: nbus.builtin.event<Feel>(),
  }),

});

// Just like event buses let you call clear/flush on all their
// nekos, the categorized event bus container will let you call
// flush and clear on all event buses.

event_bus.._meta.clear();
```

In addition to the builtin event neko, there's a built in signal neko. This is basically an `event<undefined>` neko, but with a patched `send` function so that you can just call `send()` instead of `send({})`. It comes with the `immediate` and `count` event buffers.

```typescript
import * as nbus from 'nekobasu';

let neko = nbus.builtin.signal();

neko.immediate.sub(() => console.log(`immediate`));
neko.count.sub((n) => console.log(`count ${n}`));

neko.send(); // immediate
neko.send(); // immediate
neko.send(); // immediate

neko.flush(); // count 3
```

## Advanced usage

In addition to the builtin event buffers shown here, there's `instrumented_last`, which will save the last event but also keep count of how many events have fired.

Please see the `custom_buffer` test in [src/test/basic.test.ts](src/test/basic.test.ts) to learn how to create your own event buffer and neko. It'll also show you how you can merge event buffer dictionaries, which lets you easily keep using the builtin event buffers along with your own.

Want to specify the type of your event bus? This is often handy when doing dependency injection, where we often want one component to store a reference to the bus which it gets through its constructor. See the file [example/how_to_export_type_for_dep_injection.ts](example/how_to_export_type_for_dep_injection.ts).

## Performance

A neko will only pass on events to an event buffer that has subscribers.

You can also ensure that a neko will only send events to a single event buffer using the `neko._meta.use_single_buffer('buffer_name')` function. These buffer names are type safe, so don't worry about spelling. Call `._meta.use_all_buffers()` to reset.

## Future

Hope to work on a method for logging/tracking events, to mitigate the difficulties that event spaghetti often causes in large apps.

## Meta

* Requires TypeScript 2.3 or higher (uses generic parameter defaults and `keyof`)
* See LICENSE file for license (Apache 2.0. You may also ask Oliver Uvman for a GPLv2 compatible license.)
* See CONTRIBUTING for contributor's agreement (You grant Apache 2.0 and you allow Oliver Uvman to redistribute under any GPLv2 compatible license)
