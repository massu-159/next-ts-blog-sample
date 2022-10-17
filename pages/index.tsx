import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react';
import { Loader } from 'semantic-ui-react'

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexPageProps {
  initialCatImageUrl: string;
}

const fetchCatImage = async ():Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  return result[0];
};

const Home: NextPage<IndexPageProps> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    setCatImageUrl(catImage.url);
    setIsLoading(false);
  }
  return (
    <div className='container'>
      <h1 className='title'>猫探しapp</h1>
      <button className='catButton' onClick={handleClick}>今日の猫さん</button>
      {isLoading ? (
        <Loader active ></Loader>
      ) : (
        <img className='catImage' src={catImageUrl} alt="" width={400} height="auto" />
      )}
    </div>
  )
}

// SSR（初期レンダリング時にサーバー側で画像取得して表示）
export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default Home
