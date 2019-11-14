import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/Singin';
import SignUp from '~/pages/Singup';

import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact component={SignIn}></Route>
      <Route path='/register' component={SignUp}></Route>

      <Route path='/dashboard' component={Dashboard} isPrivate></Route>
      <Route path='/profile' component={Profile} isPrivate></Route>

      <Route path='/' component={() => <h1>404</h1>}></Route>
    </Switch>
  );
}
