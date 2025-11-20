export type TCategory = {
  id: string;
  categoryName: string;
};

export type TPost = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  publicID?: string;
  categoryName?: string;
  authorEmail: string;
  links: null | string[];
  createDate: string; // ISO date string from the API
  updateDate: string; // ISO date string from the API
  author: {
    name: string;
  };
};

export type CloudinaryUploadResult = {
  event?: string;
  info?: {
    secure_url?: string;
    public_id?: string;
  };
};