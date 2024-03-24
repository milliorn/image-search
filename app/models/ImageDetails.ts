"use client";

type AlternativeSlugs = {
  [ key: string ]: string;
};

type Breadcrumb = {
  slug: string;
  title: string;
  index: number;
  type: string;
};

type Urls = {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
};

type Links = {
  self: string;
  html: string;
  download: string;
  download_location: string;
};

type TopicSubmission = {
  status: string;
  approved_on: string;
};

type ProfileImage = {
  small: string;
  medium: string;
  large: string;
};

type UserLinks = {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
};

type User = {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name?: string;
  twitter_username?: string;
  portfolio_url?: string | null;
  bio?: string | null;
  location?: string;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username?: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social?: {
    instagram_username?: string;
    portfolio_url?: string | null;
    twitter_username?: string;
    paypal_email?: string | null;
  };
};

type Ancestry = {
  type: {
    slug: string;
    pretty_slug: string;
  };
  category?: {
    slug: string;
    pretty_slug: string;
  };
  subcategory?: {
    slug: string;
    pretty_slug: string;
  };
};

type TagSource = {
  ancestry: Ancestry;
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  meta_description: string;
  cover_photo: Photo;
};

type Tag = {
  type: string;
  title: string;
  source: TagSource;
};

type Photo = {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: string;
  updated_at: string;
  promoted_at?: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description?: string;
  alt_description?: string;
  breadcrumbs: Breadcrumb[];
  urls: Urls;
  links: Links;
  likes: number;
  liked_by_user: boolean;
  current_user_collections?: any[];
  sponsorship?: any;
  topic_submissions: { [ key: string ]: TopicSubmission };
  asset_type: string;
  user: User;
  tags?: Tag[];
};

export type ImageDetails = Photo;
