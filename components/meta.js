import Head from 'next/head';

const Meta = () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos.css" rel="stylesheet"/>
    </Head>
  </div>
);
// Q: is the outermost div necessary?

export default Meta;