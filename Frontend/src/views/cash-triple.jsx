import React from 'react';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import { CashTripleCards } from 'components/dashboard';

const TextStyle = {
    cursor: 'pointer',
};

const naverLink = () => {
    document.location.href = "https://m.blog.naver.com/PostView.nhn?blogId=mql4&logNo=50042238976&proxyReferer=https:%2F%2Fwww.google.com%2F"
}

const CashTripleComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            <strong>심리 투자 법칙 - 삼중창 매매 시스템</strong> 
                        </CardTitle>
                        <CardBody className="">
                            <strong>추세 추종과 역추세 매매법을 함께 사용하며, 세 단계의 창을 거쳐 정확한 매매시점을 찾습니다.</strong><br/>
                            <strong>첫번째 창 : 시장 조류 - 장기 차트를 분석하는 것입니다. (EMA130 : 130일 동안의 거래)</strong><br/>
                            <strong>첫번째 그래프에서 매수 신호는 붉은색, 매도 신호는 파란색으로 표시했습니다.</strong><br/><br/>

                            <strong>두번째 창 : 진입 기술 - 첫번째 창과 세번째 창이 동시에 매매 신호를 냈을 때 진입 시점을 찾아내는 기법입니다. (일간 오실레이터)</strong><br/><br/>

                            <strong>세번째 창 : 시장 파도 - 추세 방향과 역향하는 파도를 파악하는 것입니다.</strong><br/>
                            <strong>첫번째 창 이동 평균이 상승하고 있을 때 세번째 그래프가 30 아래로 내려가면 매수 기회이며, 반대일 경우 매도 기회입니다.</strong><br/><br/>
                            
                            <u style={TextStyle}><strong onClick={naverLink}>위 링크를 클릭하여 삼중창 매매 설명 사이트로 넘어갈 수 있습니다.</strong></u><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Chart</h5>
                </Col>
                <Col sm={12} lg={12}>
                    <CashTripleCards />
                </Col>
            </Row>
        </div>
    );
}

export default CashTripleComponent;