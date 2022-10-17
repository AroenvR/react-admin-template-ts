import * as React from 'react';
import { Route } from 'react-router-dom';

import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

import authProvider from './providers/authProvider';
import Dashboard from './components/Dashboard';

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => {

  return (
    <Admin 
      title=""
      // layout={Layout}
      dashboard={Dashboard}
      authProvider={authProvider}
      dataProvider={dataProvider}
      // i18nProvider={i18nProvider}
    >

      <Resource name="posts" list={ListGuesser} />
      <Resource name="comments" list={ListGuesser} />

    </Admin>
  );
}

export default App;

// Stopped at dataProvider