import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { BackPredictCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://www.dnews.co.kr/uhtml/view.jsp?idxno=202007211506549230060"
}

const BackPredictComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>딥러닝을 이용한 주가 예측 (RNN)</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>딥러닝 기술의 일종인 순환 신경망(RNN)을 이용한 주가 예측입니다.</strong><br/>
                            <strong>주식 데이터는 OHLVC(종가-고가-저가-거래량-종가) 데이터를 이용했습니다.</strong><br/>
                            <strong>70%가 훈련용 데이터이며, 30%는 테스트용 데이터로 사용합니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 딥러닝 주식예측 관련 기사로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <BackPredictCards />
                </Col>
            </Row>
        </div>
    );
}

export default BackPredictComponent;