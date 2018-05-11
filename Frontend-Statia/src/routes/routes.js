import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews

// Admin pages
import Dashboard from 'src/components/Dashboard/Views/Dashboard.vue'
import ManageTeam from 'src/components/Dashboard/Views/ManageTeam.vue'
import Matches from 'src/components/Dashboard/Views/Matches.vue'
import Analysis from 'src/components/Dashboard/Views/Analysis.vue'
import Login from 'src/components/Dashboard/Views/Login.vue'
import Register from 'src/components/Dashboard/Views/Register.vue'
import Home from 'src/components/Dashboard/Views/Home.vue'
import AddPlayers from 'src/components/Dashboard/Views/AddPlayers.vue'
import EditPlayers from 'src/components/Dashboard/Views/Edit-players.vue'
import AddKPI from 'src/components/Dashboard/Views/AddKPI.vue'
import CreateMatch from 'src/components/Dashboard/Views/CreateMatch.vue'
import ViewMatch from 'src/components/Dashboard/Views/ViewMatch.vue'
import EditMatch from 'src/components/Dashboard/Views/EditMatch.vue'
import PreEvent from 'src/components/Dashboard/Views/PreEvent.vue'
import MatchEvent from 'src/components/Dashboard/Views/MatchEvent.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'manage-team',
        name: 'Manage Team',
        component: ManageTeam
      },
      {
        path: 'manage-team/edit-players',
        name: 'EditPlayers',
        component: EditPlayers
      },
      {
        path: 'manage-team/add-KPI',
        name: 'AddKPI',
        component: AddKPI
      },
      {
        path: 'matches',
        name: 'matches',
        component: Matches
      },
      {
        path: 'matches/viewMatch',
        name: 'ViewMatch',
        component: ViewMatch
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: Analysis
      },
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'addPlayers',
        name: 'AddPlayers',
        component: AddPlayers
      },
      {
        path: 'matches/createMatch',
        name: 'CreateMatch',
        component: CreateMatch
      },
      {
        path: 'matches/editMatch',
        name: 'EditMatch',
        component: EditMatch
      },
      {
        path: 'dashboard/preEvent',
        name: 'PreEvent',
        component: PreEvent
      },
      {
        path: 'dashboard/matchEvent',
        name: 'MatchEvent',
        component: MatchEvent
      },
    ]
  },

  {
    path: '/admin/manage-team',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
    ]
  }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
