import { BlogPost, Tag } from '../models/blog';
import { mockPosts, mockTags } from '../../mock/blog';

const POST_STORAGE_KEY = 'blog_posts';
const TAG_STORAGE_KEY = 'blog_tags';

const getStoredPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(POST_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(mockPosts));
  return [...mockPosts];
};

const getStoredTags = (): Tag[] => {
  const stored = localStorage.getItem(TAG_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(mockTags));
  return [...mockTags];
};

export async function getPosts() {
  return getStoredPosts();
}

export async function getTags() {
  const tags = getStoredTags();
  const posts = getStoredPosts();
  return tags.map(tag => ({
    ...tag,
    postCount: posts.filter(post => post.tags?.includes(tag.name)).length
  }));
}

export async function getPostBySlug(slug: string) {
  const posts = getStoredPosts();
  return posts.find(p => p.slug === slug);
}

export async function addPost(post: Partial<BlogPost>) {
  const posts = getStoredPosts();
  const newPost = {
    ...post,
    id: Date.now().toString(),
    views: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  } as BlogPost;
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify([newPost, ...posts]));
  return newPost;
}

export async function updatePost(id: string, post: Partial<BlogPost>) {
  let posts = getStoredPosts();
  posts = posts.map(p => p.id === id ? { ...p, ...post } as BlogPost : p);
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

export async function deletePost(id: string) {
  let posts = getStoredPosts();
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

export async function addTag(tag: Partial<Tag>) {
  const tags = getStoredTags();
  const newTags = [{ ...tag, postCount: 0 } as Tag, ...tags];
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(newTags));
}

export async function updateTag(oldName: string, tag: Partial<Tag>) {
  let tags = getStoredTags();
  tags = tags.map(t => t.name === oldName ? { ...t, ...tag } as Tag : t);
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
}

export async function deleteTag(name: string) {
  let tags = getStoredTags();
  tags = tags.filter(t => t.name !== name);
  localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(tags));
}

export async function increaseView(id: string) {
  let posts = getStoredPosts();
  posts = posts.map((p) => {
    if (p.id === id) {
      return { ...p, views: (p.views || 0) + 1 };
    }
    return p;
  });
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

export async function getRelatedPosts(currentId: string, tags: string[]) {
  const posts = getStoredPosts();
  return posts
    .filter((p) => 
      p.id !== currentId && 
      p.status === 'published' && 
      p.tags?.some((t) => tags?.includes(t))
    )
    .slice(0, 3);
}