import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
