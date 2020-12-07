import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { CashDualCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://www.hankyung.com/finance/article/2019040833591"
}

const CashDualComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>심리 투자 법칙 - 듀얼 모멘텀 전략</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>모멘텀은 '물체를 움직이는 힘'을 의미합니다. 주식 시장에서도 한번 움직이기 시작한 주식 가격이 계속 그 방향으로 나아가려는 성질을 말합니다.</strong><br/>
                            <strong>최근 6~12개월 동안의 상대적으로 수익률이 높은 종목을 매수하는것이 상대적 모멘텀 전략입니다.</strong><br/>
                            <strong>상승장에서만 투자하고 하락장에서는 국채나 현금으로 갈아타는 것이 절대적 모멘텀 전략이며, 동시에 사용하는 것이 듀얼 모멘텀 전략 입니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 듀얼 모멘텀 관련 기사로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <CashDualCards />
                </Col>
            </Row>
        </div>
    );
}

export default CashDualComponent;