import {
  ISignal,
  ISignalHandler,
  ISimpleEvent,
  ISimpleEventHandler,
  ISubscribable,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

import { EventBufferImpl } from './event_buffer'; // use type only

export type Reducer<E, R=E, S=R> = (acc:R|S, next:E) => R;
export type OnFeed<E, R=E, S=R> = (event:E, self:EventBufferImpl<E, R, S>) => ShouldAbort;
export type OnFlush<E, R=E, S=R> = (self:EventBufferImpl<E, R, S>) => ShouldAbort;

export enum ShouldAbort {
  yes,
  no,
}

// E = event type
// R = reduction result type
// S = reduction start value type

export interface EventBufferSpec<E, R=E, S=R> {
  reducer:Reducer<E, R, S>;
  start_value:S;
  before_feed?:OnFeed<E, R, S>;
  before_flush?:OnFlush<E, R, S>;
}

export interface EventBuffer<E, R=E> extends ISimpleEvent<R> {
  feed(event:E) : void;
  flush() : void;
  clear() : void;
}

export interface EventBufferDict<E> {
  [buffer_name:string]:EventBuffer<E, any>;
}

export interface Neko<E, B> {
  dispatch(event:E) : void;
  use_single_buffer(buffer_name:B) : void;
  use_all_buffers() : void;
  get_current_used_buffer() : B | undefined;
  flush() : void;
}

export interface SignalNeko<B> {
  signal() : void;
  use_single_buffer(buffer_name:B) : void;
  use_all_buffers() : void;
  get_current_used_buffer() : B | undefined;
  flush() : void;
}

