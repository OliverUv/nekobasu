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

import {
  ISimpleEvent,
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
// N = list of names (of a Neko or EventBuffer in a dict)

export interface EventCategories<N> {
  _meta:{
    flush() : void;
    clear() : void;
  };
}

export interface EventBus<N> {
  _meta:{
    flush() : void;
    clear() : void;
  };
}

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
export interface NekoDict {
  [event_buffer_name:string]:Neko<any, any>|SignalNeko<any>;
}
export interface EventBusDict {
  [category_name:string]:EventBus<any>;
}

export interface BaseNeko<E, N> {
  flush() : void;
  _meta:{
    clear() : void;
    get_current_used_buffer() : N | undefined;
    use_all_buffers() : void;
    use_single_buffer(buffer_name:N) : void;
  };
}

export interface Neko<E, N> extends BaseNeko<E, N> {
  send(event:E) : void;
}

export interface SignalNeko<N> extends BaseNeko<undefined, N> {
  send() : void;
}
