export type AssetData = {
  id: number;
  asset_name: string;
  asset_id: string;
  category: string;
  status: "Ready to Deployed" | "Deployed";
  location: string;
  created_date: string;
  updated_at: string;
};