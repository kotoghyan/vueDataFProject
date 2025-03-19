const routes = [
  {
    name: 'home',
    redirect: () => ({ name: 'advertisers' }),
  },
  {
    component: () => import('layouts/MainLayout/index.vue'),
    children: [
      {
        path: '/advertisers',
        children: [
          {
            name: 'advertisers',
            path: '',
            component: () => import('pages/Advertisers/Advertisers.vue'),
            meta: {
              title: 'Advertisers',
              requiresAuth: true,
            },
          },
          {
            name: 'newAdvertiser',
            path: 'new',
            component: () => import('pages/Advertisers/NewAdvertiser.vue'),
            meta: {
              title: 'New Advertisers',
              requiresAuth: true,
            },
          },
          {
            name: 'editAdvertiser',
            path: ':id/edit',
            component: () => import('pages/Advertisers/EditAdvertiser.vue'),
            meta: {
              title: 'Edit Advertiser',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/creatives',
        children: [
          {
            name: 'creatives',
            path: '',
            component: () => import('pages/Creatives/Creatives.vue'),
            meta: {
              title: 'Creatives',
              requiresAuth: true,
            },
          },
          {
            name: 'newCreative',
            path: 'new',
            component: () => import('pages/Creatives/NewCreative.vue'),
            meta: {
              title: 'New Creative',
              requiresAuth: true,
            },
          },
          {
            name: 'editCreative',
            path: ':id/edit',
            component: () => import('pages/Creatives/EditCreative.vue'),
            meta: {
              title: 'Edit Creative',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/campaigns',
        children: [
          {
            name: 'campaigns',
            path: '',
            component: () => import('pages/Campaigns/Campaigns.vue'),
            meta: {
              title: 'Campaigns',
              requiresAuth: true,
            },
          },
          {
            name: 'newCampaign',
            path: 'new',
            component: () => import('pages/Campaigns/NewCampaign.vue'),
            meta: {
              title: 'New Campaign',
              requiresAuth: true,
            },
          },
          {
            name: 'editCampaign',
            path: ':id/edit',
            component: () => import('pages/Campaigns/EditCampaign.vue'),
            meta: {
              title: 'Edit Campaign',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/deals',
        children: [
          {
            name: 'newDeal',
            path: 'new',
            component: () => import('pages/Deals/NewDeal.vue'),
            meta: {
              title: 'New Deals',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/events',
        children: [
          {
            name: 'events',
            path: '',
            component: () => import('pages/Events/Events.vue'),
            meta: {
              title: 'Events',
              requiresAuth: true,
            },
          },
          {
            name: 'newEvent',
            path: 'new',
            component: () => import('pages/Events/NewEvent.vue'),
            meta: {
              title: 'New Event',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/line-items',
        children: [
          {
            name: 'lineItems',
            path: '',
            component: () => import('pages/LineItems/LineItems.vue'),
            meta: {
              title: 'Line Items',
              requiresAuth: true,
            },
          },
          {
            name: 'newLineItem',
            path: 'new',
            component: () => import('pages/LineItems/NewLineItem/index.vue'),
            meta: {
              title: 'New Line Item',
              requiresAuth: true,
            },
          },
          {
            name: 'editLineItem',
            path: ':id/edit',
            component: () => import('pages/LineItems/EditLineItem/index.vue'),
            meta: {
              title: 'Edit Line Item',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/lists',
        children: [
          {
            name: 'lists',
            path: '',
            component: () => import('pages/Lists/Lists.vue'),
            meta: {
              title: 'Lists',
              requiresAuth: true,
            },
          },
          {
            name: 'newList',
            path: 'new',
            component: () => import('pages/Lists/NewList.vue'),
            meta: {
              title: 'New List',
              requiresAuth: true,
            },
          },
          {
            name: 'editList',
            path: ':id/edit',
            component: () => import('pages/Lists/EditList.vue'),
            meta: {
              title: 'Edit List',
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: '/dashboard',
        children: [
          {
            name: 'dashboard',
            path: '',
            component: () => import('pages/Dashboards/Dashboard.vue'),
            meta: {
              title: 'Dashboard',
              requiresAuth: true,
            },
          },
          {
            name: 'reportCenter',
            path: '/report-center',
            component: () => import('pages/ReportCenter/index.vue'),
            meta: {
              title: 'Report Center',
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
  {
    component: () => import('layouts/BlankLayout/index.vue'),
    children: [
      {
        name: 'register',
        path: '/register',
        component: () => import('pages/Auth/Register/index.vue'),
        meta: {
          title: 'Register',
        },
      },
      {
        name: 'login',
        path: '/login',
        component: () => import('pages/Auth/Login/index.vue'),
        meta: {
          title: 'Login',
        },
      },
      {
        path: '/billing',
        children: [
          {
            name: 'billing',
            path: '',
            component: () => import('pages/Auth/Billing/index.vue'),
            meta: {
              title: 'Billing',
            },
          },
          {
            name: 'creditApplicationBilling',
            path: 'credit-application',
            component: () => import('pages/Auth/Billing/CreditApplication.vue'),
            meta: {
              title: 'Credit Application Billing',
            },
          },
          {
            name: 'achBilling',
            path: 'ach',
            component: () => import('pages/Auth/Billing/Ach.vue'),
            meta: {
              title: 'ACH Billing',
            },
          },
          {
            name: 'creditCardBilling',
            path: 'credit-card',
            component: () => import('pages/Auth/Billing/CreditCard.vue'),
            meta: {
              title: 'Credit Card',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
