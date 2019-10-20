export const routes = [
  {
    label: 'Login',
    path: '/login',
    component: 'login'
  },
  {
    label: 'App',
    path: '/',
    component: 'apps',
    private: true,
    routes: [
      {
        label: 'Dashboard',
        path: '/🥢',
        component: 'dashboard',
        exact: true
      },
      {
        label: 'Manage Site',
        path: '/🥢/siteJ',
        component: 'siteJ',
        exact: true
      },
      {
        label: 'Manage Shop',
        path: '/🥢/shopJ',
        component: 'shopJ',
        exact: true
      },
      {
        label: 'Manage Dish',
        path: '/🥢/dishJ',
        component: 'dishJ',
        exact: true
      },
      {
        label: 'Manage Menu',
        path: '/🥢/menuJ/',
        component: 'menuJ',
        exact: true
      },
      {
        label: 'Manage Menu Detail',
        path: '/🥢/menuJ/:slug',
        component: 'menudetailJ'
      },
      {
        label: 'Manage Order',
        path: '/🥢/orderJ',
        component: 'orderJ',
        exact: true
      },
      {
        label: 'Manage User',
        path: '/🥢/user',
        component: 'user',
        exact: true
      }
    ]
  }
]

export const menuRoutes = [
  {
    id: 'manage-site',
    label: 'Manage Site',
    path: '/🥢/siteJ',
    icon: 'environment',
    code: 'SITE'
  },
  {
    id: 'manage-shop',
    label: 'Manage Shop',
    path: '/🥢/shopJ',
    icon: 'shop',
    code: 'SHOP'
  },
  {
    id: 'manage-dish',
    label: 'Manage Dish',
    path: '/🥢/dishJ',
    icon: 'coffee',
    code: 'DISH'
  },
  {
    id: 'manage-menu',
    label: 'Manage Menu',
    path: '/🥢/menuJ',
    icon: 'bars',
    code: 'MENU'
  },
  {
    id: 'manage-order',
    label: 'Manage Order',
    path: '/🥢/orderJ',
    icon: 'shopping-cart',
    code: 'ORDER'
  },
  {
    id: 'manage-user',
    label: 'Manage User',
    path: '/🥢/user',
    icon: 'user',
    code: 'USER'
  }
]
