// BlogPost and Tag types
export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string;
  tags: string[];
  author: Author;
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
}

export interface Tag {
  name: string;
  postCount: number;
}
