// Copyright 2017 Oliver Uvman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { test } from 'ava';

import * as nbus from '../';

test(async function throws_on_reserved_name_use_neko(t) {
  const event_buffer = nbus.builtin.event_buffers;
  const create_signal_neko = nbus.create_signal_neko;
  const create_event_neko = nbus.create_neko;

  t.plan(6);

  const signal_a = { send: event_buffer.immediate<undefined>() };
  const signal_b = { flush: event_buffer.immediate<undefined>() };
  const signal_c = { _meta: event_buffer.immediate<undefined>() };

  t.throws(() => create_signal_neko<typeof signal_a>(signal_a));
  t.throws(() => create_signal_neko<typeof signal_b>(signal_b));
  t.throws(() => create_signal_neko<typeof signal_c>(signal_c));

  const event_a = { send: event_buffer.immediate<number>() };
  const event_b = { flush: event_buffer.immediate<number>() };
  const event_c = { _meta: event_buffer.immediate<number>() };

  t.throws(() => create_event_neko<number, typeof event_a>(event_a));
  t.throws(() => create_event_neko<number, typeof event_b>(event_b));
  t.throws(() => create_event_neko<number, typeof event_c>(event_c));
});

test(async function throws_on_reserved_name_use_event_bus(t) {
  const event_buffer = nbus.builtin.event_buffers;
  const create_signal_neko = nbus.create_signal_neko;
  const create_event_neko = nbus.create_neko;

  t.plan(1);

  const signal_a = { whatever: event_buffer.immediate<undefined>() };
  const neko = create_signal_neko<typeof signal_a>(signal_a);
  const nekos = {
    _meta: neko,
  };

  t.throws(() => nbus.create<typeof nekos>(nekos));
});

test(async function bad_custom_buffer(t) {
  const doubler_buffer = nbus.create_event_buffer<number>({
    reducer: (acc, next) => acc + 2 * next,
      start_value: 0,
  });

  const csv_buffer = nbus.create_event_buffer<number, string, undefined>({
    reducer: (acc, next) => {
      if (acc == undefined) {
        return next.toString();
      }
      return `${acc},${next}`;
    },
    start_value: undefined,
  });

  const dumb_buffers = {
    doubler: doubler_buffer,
    csv: csv_buffer,
  };

  const buf_dict = nbus.builtin.modify.merge_ebs(
    dumb_buffers,
    nbus.builtin.event_ebs<number>(),
  );

  function neko_creator() {
    return nbus.create_neko<number, typeof buf_dict>(buf_dict);
  }

  const event_bus = nbus.create({
    my_numbers: neko_creator(),
    your_numbers: neko_creator(),
  });

  t.plan(2);

  // This one should not trigger since we only send to my_numbers,
  // but will trigger if you haven't constructed individual buffers.
  // See the custom_buffer test in basic.test.ts for info on how to
  // do it properly.
  event_bus.your_numbers.immediate.sub(() => t.pass());

  // This one should trigger as expected.
  event_bus.my_numbers.immediate.sub(() => t.pass());

  event_bus.my_numbers.send(1);
});

test(async function duplicate_event_buffer_names_during_merge(t) {
  const dumb_buffers = {
    immediate: <any>null, // will collide
    no_problem: <any>null,
    completely_fine: <any>null,
  };

  t.plan(1);

  try {
    const buf_dict = nbus.builtin.modify.merge_ebs(
      dumb_buffers,
      nbus.builtin.event_ebs<number>(),
    );
  } catch (e) {
    t.regex(e.message, /immediate/);
  }
});
