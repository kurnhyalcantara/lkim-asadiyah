import { Pending } from '@abraham/remotedata';
import { property } from '@polymer/decorators';
import { PolymerElement } from '@polymer/polymer';
import { Constructor } from 'lit-element';
import { RootState, store } from '../store';
import { fetchPengurusList } from '../store/pengurus/actions';
import { initialPengurusState, PengurusState } from '../store/pengurus/state';

/* @polymerMixin */
export const PengurusHoC = <
  T extends Constructor<PolymerElement & { stateChanged(_state: RootState): void }>
>(
  subclass: T
) => {
  class PengurusClass extends subclass {
    @property({ type: Object })
    pengurus: PengurusState = initialPengurusState;

    stateChanged(state: RootState) {
      super.stateChanged(state);
      this.pengurus = state.pengurus;
    }

    connectedCallback() {
      super.connectedCallback();

      if (this.pengurus instanceof Pending) {
        store.dispatch(fetchPengurusList());
      }
    }
  }

  return PengurusClass;
};
