import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ history }) {
  useEffect(() => {
    const listen = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      listen();
    }
  }, []);

  return (null);
}

export default withRouter(ScrollToTop);