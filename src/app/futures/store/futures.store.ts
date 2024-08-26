import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { FuturesService } from "../data-access/futures.service";
import { Stock } from "../../shared/model/stock.model";
import { getPreviousWeekdayDate } from "src/app/shared/utils/utils";
import { DateTime } from "luxon";

interface StockState {
    stocks: Stock[],
    isLoading: boolean,
    filter: {timestamp: string, symbol: string}
}

const initialState: StockState  = {
    stocks: [],
    isLoading: false,
    filter: {timestamp: DateTime.fromJSDate(getPreviousWeekdayDate()).toFormat("yyyy-MM-dd"), symbol:''}
}

export const futuresStore = signalStore(
    withState(initialState),
    withMethods((store) => {
        const service = inject(FuturesService);
        return {
            async loadAll(): Promise<void> {
                patchState(store, {isLoading: true});
                const response = await service.getStockOiData(store.filter.symbol(), store.filter.timestamp());
                patchState(store, {stocks: response?.data as Stock[], isLoading: false});
            }
        }
    })
);
