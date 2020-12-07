import MainConponent from '../views/main.jsx';
import InfoComponent from '../views/info.jsx';
import CashEffectComponent from '../views/cash-effect.jsx';
import CashBollingerFollowComponent from '../views/cash-bollinger-follow.jsx';
import CashBollingerReverseComponent from '../views/cash-bollinger-reverse.jsx';
import CashTripleComponent from '../views/cash-triple.jsx';
import CashDualComponent from '../views/cash-dual.jsx';
import BackTestComponent from '../views/back-test.jsx';
import BackPredictComponent from '../views/back-predict.jsx';
import BackLinkComponent from '../views/back-link.jsx';

var ThemeRoutes = [
  {
    path: '/main',
    name: '메인 페이지',
    icon: 'mdi mdi-home',
    component: MainConponent
  },
  {
    path: '/info',
    name: '시세 조회',
    icon: 'mdi mdi-chart-line',
    component: InfoComponent
  },
  {
    path: '/cash-effect',
    name: '효율적 투자선',
    icon: 'mdi mdi-numeric-1-box-multiple-outline',
    component: CashEffectComponent
  },
  {
    path: '/cash-bollinger-follow',
    name: '볼린저 밴드 - 추세',
    icon: 'mdi mdi-numeric-2-box-multiple-outline',
    component: CashBollingerFollowComponent
  },
  {
    path: '/cash-bollinger-reverse',
    name: '볼린저 밴드 - 반전',
    icon: 'mdi mdi-numeric-3-box-multiple-outline',
    component: CashBollingerReverseComponent
  },
  {
    path: '/cash-triple',
    name: '삼중창 매매',
    icon: 'mdi mdi-numeric-4-box-multiple-outline',
    component: CashTripleComponent
  },
  {
    path: '/cash-dual',
    name: '듀얼 모멘텀',
    icon: 'mdi mdi-numeric-5-box-multiple-outline',
    component: CashDualComponent
  },
  {
    path: '/back-test',
    name: '백테스트',
    icon: 'mdi mdi-laptop-windows',
    component: BackTestComponent
  },
  {
    path: '/back-predict',
    name: '주가예측 (머신러닝)',
    icon: 'mdi mdi-numeric',
    component: BackPredictComponent
  },
  {
    path: '/link',
    name: '참고 사이트',
    icon: 'mdi mdi-link-variant',
    component: BackLinkComponent
  },
  {
    path: '/',
    pathTo: '/main',
    name: '메인 페이지',
    redirect: true
  }
];
export default ThemeRoutes;
