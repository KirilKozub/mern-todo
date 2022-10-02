import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import TodoPage from './pages/TodoPage/TodoPage'
import AuthPage from './pages/AuthPage/AuthPage'


export const useRoutes = (isLogin) => {
    if (isLogin) {
        return (
            <Switch>
                <Route path="/" exact component={TodoPage} />
                <Redirect to="/" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/login" exact component={AuthPage} />
            <Redirect to="/login" />
        </Switch>
    )
}