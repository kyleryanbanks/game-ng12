import { Injectable } from '@angular/core';
import { Frame } from '@game-ng12/game-loop';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Observable } from 'rxjs';

export interface Recording {
  id: string;
  frames: Frame[];
}

export interface State extends EntityState<Recording> {
  selectedId: string | null;
}

export const adapter = createEntityAdapter<Recording>();

export const initialState = adapter.getInitialState({
  selectedId: null,
});

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

@Injectable({ providedIn: 'root' })
export class RecordingsStore extends ComponentStore<State> {
  constructor() {
    super(initialState);
  }

  Recording = (id: number) =>
    this.select(this.select(selectEntities), (entities) => entities[id]);

  getRecordings(): Observable<Recording[]> {
    return this.select(selectAll);
  }

  getSelectedRecording() {
    return this.select((state) =>
      state.selectedId ? state.entities[state.selectedId] : undefined
    );
  }

  upsertRecording(recording: Recording) {
    this.setState((state) => adapter.upsertOne(recording, state));
  }

  deleteRecording(id: string) {
    this.setState((state) => adapter.removeOne(id, state));
  }

  selectRecording(selectedId: string) {
    this.setState((state) => ({ ...state, selectedId }));
  }
}
