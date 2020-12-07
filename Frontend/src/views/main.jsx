import React from 'react';
import { Link } from 'react-router-dom';
import {
    Badge,
    Row,
    Col,
    Card,
    CardText,
    CardBody,
    CardTitle,
    Button,
} from 'reactstrap';

const InfoStyle = {
    height: '60px',
};

const ButtonStyle = {
    width: '100%',
};

const naverLink = () => {
    document.location.href = "https://finance.naver.com/"
}

const creonLink = () => {
    document.location.href = "https://www.creontrade.com/"
}

const yahooLink = () => {
    document.location.href = "https://finance.yahoo.com/"
}

const ssafyLink = () => {
    document.location.href = "http://edu.ssafy.com/edu/main/index.do"
}

const MainComponent = () => {
    return (
        <div>
            <Row>
                <Col sm={12} lg={12}>
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-comment-processing-outline mr-2"> </i>
                            SSAFY STOCK
                        </CardTitle>
                        <CardBody className="">
                            <strong>증권 데이터 분석을 통한 자동매매, 주가예측 웹 서비스 개발 서비스 입니다.</strong><br/>
                            <strong>시세 조회, 매매 전략, 주가 예측 등을 제공하며, 직접적인 주가 매매 서비스는 지원하지 않습니다.</strong><br/><br/>
                            <strong>원하는 기업을 검색하여 시세 조회 및 기타 전략에 대한 상세 서비스를 제공합니다.</strong><br/>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={12}>
                    <h5 className="mb-3">Menu</h5>
                </Col>
                <Col xs="12" md="3">
                    <Card body outline color="secondary" className="border">
                        <CardTitle><strong>시세 조회</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>네이버 금융 데이터 API 기반 <br/> 원하는 기업의 시세를 확인 가능합니다.</strong></CardText>
                        <Link to="/info">
                            <Button color="secondary" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                    <Card body outline color="primary" className="border">
                        <CardTitle><strong>효율적 투자선</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>투자자가 인내할 수 있는 리스크에서 <br/> 최상의 기대수익률을 제공합니다.</strong></CardText>
                        <Link to="/cash-effect"> 
                            <Button color="primary" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                <Card body outline color="success" className="border">
                        <CardTitle><strong>볼린저 밴드 - 추세</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>상승 추세에 매수하고 <br/> 하락 추세에 매도하는 전략입니다.</strong></CardText>
                        <Link to="/cash-bollinger-follow"> 
                            <Button color="success" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                <Card body outline color="info" className="border">
                        <CardTitle><strong>볼린저 밴드 - 반전</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>주가가 반전하는 지점을 찾아 <br/> 매수 또는 매도하는 전략입니다.</strong></CardText>
                        <Link to="/cash-bollinger-reverse"> 
                            <Button color="info" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                <Card body outline color="warning" className="border">
                        <CardTitle><strong>삼중창 매매 전략</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>세 단계의 방법을 거쳐 <br/> 정확한 매매 시점을 찾는 전략입니다.</strong></CardText>
                        <Link to="/cash-triple"> 
                            <Button color="warning" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                <Card body outline color="danger" className="border">
                        <CardTitle><strong>듀얼 모멘텀 전략</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>상대적 모멘텀 전략과 <br/> 절대적 모멘텀 전략을 합친 듀얼 전략입니다.</strong></CardText>
                        <Link to="/cash-dual"> 
                            <Button color="danger" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                    <Card body outline color="primary" className="border">
                        <CardTitle><strong>백테스트</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>과거 데이터를 기반으로 <br/> 주식 투자 테스트를 진행하는 테스트입니다.</strong></CardText>
                        <Link to="/back-test"> 
                            <Button color="primary" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="3">
                    <Card body outline color="warning" className="border">
                        <CardTitle><strong>RNN 주가 예측</strong></CardTitle>
                        <CardText style={InfoStyle}><strong>딥러닝 기술 중 순환 신경망을 사용해 <br/> 주가 예측을 진행해봅니다.</strong></CardText>
                        <Link to="/back-predict"> 
                            <Button color="warning" style={ButtonStyle}><strong>페이지 이동</strong></Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs="12" md="12">
                    <Card>
                        <CardTitle className="bg-light border-bottom p-3 mb-0">
                            <i className="mdi mdi-arrange-send-backward mr-2"> </i>
                            Link
                        </CardTitle>
                        <CardBody className="">
                            <div>
                                <Button color="success" className="ml-3" outline onClick={naverLink}>
                                    네이버 금융 서비스 <Badge color="success">NAVER</Badge>
                                </Button>

                                <Button color="primary" className="ml-3" outline onClick={creonLink}>
                                    온라인 주식 거래 서비스 - 크레온 <Badge color="primary">대신증권</Badge>
                                </Button>

                                <Button color="danger" className="ml-3" outline onClick={yahooLink}>
                                    야후 파이낸스 서비스 <Badge color="danger">YAHOO</Badge>
                                </Button>
                                
                                <Button color="info" className="ml-3" outline onClick={ssafyLink}>
                                    SSAFY <Badge color="info">HomePage</Badge>
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default MainComponent;
