import useSWRMutation from 'swr/mutation';

type ContentAgentProps = {
  ourUrl?: string;
  city?: string;
  industry?: string;
  keyword?: string;
  competitor1Url?: string;
  competitor2Url?: string;
  service?: string;
  userChosenIdea?: string;
  content?: string;
  conversationHistory?: Record<string, unknown>[];
};

async function fetchContentAgent(url: string, { arg }: { arg: ContentAgentProps }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export const useContentAgent = ( ) =>{
    const { trigger, data, error, isMutating } = useSWRMutation(
        '/api/content-agent',
        fetchContentAgent
      );

    return {
        trigger, // call: trigger(formData)
        data,
        error,
        isLoading: isMutating,
      };
}
