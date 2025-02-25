const FACTS_API_URL =
  process.env.NEXT_PUBLIC_DOG_FACTS_API_URL || 'https://dog-api.kinduff.com/api/facts';

const FALLBACK_FACT =
  "Dogs' noses are unique, like human fingerprints! Each dog has a distinctive nose print pattern that can be used for identification.";

interface DogFactResponse {
  facts: string[];
  success: boolean;
}

export async function getDogFact(): Promise<string> {
  try {
    const response = await fetch(FACTS_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch dog fact');
    }

    const data: DogFactResponse = await response.json();
    return data.facts[0];
  } catch (error) {
    console.error('Failed to fetch dog fact:', error);
    return FALLBACK_FACT;
  }
}
