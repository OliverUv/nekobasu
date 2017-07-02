import {
  ISignal,
  ISignalHandler,
  ISimpleEvent,
  ISimpleEventHandler,
  ISubscribable,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

import { EventBufferImpl } from './event_buffer'; // use type only

export type Reducer<E, R=E> = (acc:R, next:E) => R;
export type OnFeed<E, R=E> = (event:E, self:EventBufferImpl<E, R>) => ShouldAbort;
export type OnFlush<E, R=E> = (self:EventBufferImpl<E, R>) => ShouldAbort;

export enum ShouldAbort {
  yes,
  no,
}

export interface EventBufferSpec<E, R=E> {
  reducer:Reducer<E, R>;
  start_value:R;
  on_feed?:OnFeed<E, R>;
  on_flush?:OnFlush<E, R>;
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

