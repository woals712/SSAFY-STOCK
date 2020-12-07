import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { CashBollingerReverseCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://terms.naver.com/entry.nhn?docId=3571973&cid=58781&categoryId=58781"
}

const CashBollingerReverseComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>현대 포트폴리오 이론 - 볼린저 밴드 반전 매매 기법</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>주가가 반전하는 지점을 찾아내 매수 또는 매도하는 기법입니다.</strong><br/>
                            <strong>주가가 하단 밴드를 여러 차례 태그하는 과정에서 강세 지표가 발생하면 매수합니다. (매수 : 빨간색 삼각형)</strong><br/>
                            <strong>주가가 상단 밴드를 여러 차례 태그하는 과정에서 약세 지표가 발생하면 매도합니다. (매도 : 파란색 삼각형)</strong><br/><br/>

                            <strong>상단 볼린저 밴드는 상대적인 고점을 나타내며, 하단 볼린저 밴드는 상대적인 저점을 나타냅니다.</strong><br/>
                            <strong>밴드폭이 좁을수록 주가 변동성이 작고, 밴드폭이 넓을 수록 주가 변동성이 큽니다.</strong><br/>
                            <strong>네이버 종가 (close), 상단 볼린저 밴드 (upper), 중간 볼린저 밴드 (MA20), 하단 볼린저 밴드 (lower)</strong><br/><br/>

                            <strong>밴드폭 (%b)는 현재 주가가 어디 쯤에 있는지를 수치로 나타낸 것입니다.</strong><br/>
                            <strong>일중강도율 (II%)는 거래량 강도 입니다.</strong><br/>
                            <strong>주가가 하단 볼린저 밴드에 닿을 때 일중 강도율이 +이면 매수하고, 주가가 상단 볼린저 밴드에 닿을 때 일중 강도율이 -이면 매도합니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 볼린저 밴드 설명 사이트로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <CashBollingerReverseCards />
                </Col>
            </Row>
        </div>
    );
}

export default CashBollingerReverseComponent;