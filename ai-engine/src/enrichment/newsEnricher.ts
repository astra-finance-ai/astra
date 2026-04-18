import { getEnv } from '../config/env';

const env = getEnv();

interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  source: string;
}

export async function fetchNews(query: string): Promise<string[]> {
  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', query);
    url.searchParams.append('apiKey', env.NEWS_API_KEY);
    url.searchParams.append('pageSize', '5');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('language', 'en');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'ok' || !data.articles) {
      console.warn('NewsAPI error or no articles:', data);
      return [];
    }

    return data.articles.slice(0, 5).map((article: NewsArticle) => 
      `• ${article.title} - ${article.source.name} (${new Date(article.publishedAt).toLocaleDateString()})`
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export function buildNewsQuery(assetType: string, country: string, region: string): string {
  const terms = [country, region];
  
  if (assetType === 'real_estate') {
    terms.push('real estate', 'property market');
  } else if (assetType === 'invoice') {
    terms.push('SME', 'business finance');
  } else if (assetType === 'agricultural') {
    terms.push('agriculture', 'farming');
  }
  
  return terms.join(' OR ');
}
