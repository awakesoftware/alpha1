import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Account from './Account/Account';
import ChangePassword from './ChangePassword/ChangePassword';
import ChangeTheme from './ChangeTheme/ChangeTheme';
import Payment from './Payment/Payment';
import Contact from './Contact/Contact'

import SideNav from './SideNav/SideNav';
import Footer from '../../components/Footer/Footer';


export default function Settings() {

    return (
        <div className='settings'>

            <SideNav/>

            <div className='settings-main'>
                <h1>Settings</h1>
                <Switch>
                    <Route exact path='/settings/account' component={Account}/>

                    <Route path='/settings/password' component={ChangePassword}/>

                    <Route path='/settings/payment' component={Payment} />

                    <Route path='/settings/appearance' component={ChangeTheme}/>

                    <Route path='/settings/contact' component={Contact}/>
                </Switch>
            </div>

        </div>

    );
};
