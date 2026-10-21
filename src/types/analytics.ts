export type AnalyticsEventName =
  | 'view_item'
  | 'search'
  | 'filter_applied'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout';

export interface AnalyticsPayloads {
  view_item: {
    productId: string;
    productName: string;
    price: number;
    category?: string;
  };
  search: {
    query: string;
    resultsCount: number;
  };
  filter_applied: {
    filterType: string;
    value: string | number | boolean;
  };
  add_to_cart: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  };
  remove_from_cart: {
    productId: string;
    productName: string;
  };
  begin_checkout: {
    itemCount: number;
    subtotal: number;
  };
}

export interface AnalyticsEvent<K extends AnalyticsEventName = AnalyticsEventName> {
  name: K;
  timestamp: string;
  payload: AnalyticsPayloads[K];
}
