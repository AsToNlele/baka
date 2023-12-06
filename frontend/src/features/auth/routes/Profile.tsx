import React, { useEffect, useState } from 'react';

export const Profile = () => {
  const [data, setData] = useState({});
  const getProfile = () =>
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => setData(data));

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      Profile
      {JSON.stringify(data)}
    </>
  );
};
