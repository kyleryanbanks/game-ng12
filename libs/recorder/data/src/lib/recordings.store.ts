import { Injectable } from '@angular/core';
import { RealTimeHeldFrame } from '@game-ng12/game-loop';
import { ComponentStore } from '@ngrx/component-store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Observable } from 'rxjs';

export interface Recording {
  id: string;
  frames: RealTimeHeldFrame[];
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

  Recording = (id: string) =>
    this.select(this.select(selectEntities), (entities) => entities[id]);

  getRecordings(): Observable<Recording[]> {
    return this.select(selectAll);
  }

  getFramesForSelectedRecording = (id: string) => {
    return this.get().entities[id]?.frames;
  };

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
