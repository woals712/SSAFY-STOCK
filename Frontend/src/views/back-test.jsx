import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { BackTestCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://m.blog.naver.com/PostView.nhn?blogId=inyhan97&logNo=221536841538&proxyReferer=https:%2F%2Fwww.google.com%2F"
}

const BackTestComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>백트레이더를 활용한 백테스트</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>최근 인기를 끌고 있는 퀀트 투자에서 핵심 요소 입니다.</strong><br/>
                            <strong>특정 투자 전략을 실제로 시장에 적용해보기 전에, 과거 데이터를 사용해 해당 전략이 얼마나 효과적인지를 검증하는데 사용됩니다.</strong><br/>
                            <strong>연평균 성장률(CAGR), 최대 손실 낙폭(MDD), 상관계수, 샤프지수 등이 통계적 지표로 사용되기도 합니다.</strong><br/><br/>
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 미국 주식 백테스트 사이트로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Table</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <BackTestCards />
                </Col>
            </Row>
        </div>
    );
}

export default BackTestComponent;