import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Allowlist from '../components/Allowlist';

function MyAllowlistsPage({ walletStore }) {
  const [allowlists, setAllowlists] = useState([]);

  useEffect(() => {
    (async () => {
      const userAddress = window.localStorage
        .getItem('addr')
        .split('"')
        .join('');
      if (!userAddress) {
        return;
      }

      const url = '/api/v1/allowlist';
      const res = await axios.get(url);
      setAllowlists(res.data);
    })();
  }, []);

  return (
    <div>
      <h1 style={{ padding: '0 5% 0 5%' }}>My allowlists</h1>
      {allowlists.map((allowlist) => {
        return (
          <Allowlist
            key={allowlist.id}
            {...allowlist}
            isAdmin={true}
            walletStore={walletStore}
          ></Allowlist>
        );
      })}
    </div>
  );
}

export default MyAllowlistsPage;
