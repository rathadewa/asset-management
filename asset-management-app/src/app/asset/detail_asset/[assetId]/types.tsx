export type Asset = {
  id: number;
  asset_name: string;
  asset_id: string;
  asset_category: string;
  asset_status: "Ready to Deployed" | "Deployed";
  asset_location: string;
  asset_created: string;
  asset_updated: string;
};