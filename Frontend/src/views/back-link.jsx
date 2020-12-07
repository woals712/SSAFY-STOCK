import React from 'react';
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardGroup,
    Button,
    Badge,
} from 'reactstrap';

import img1 from '../assets/images/stock1.JPG';
import img2 from '../assets/images/stock2.JPG';
import img3 from '../assets/images/stock3.JPG';

const ImageStyle = {
    height: '350px',
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

const BackLinkComponent = () => {
    return (
        <div>
            <h5 className="mb-3"><strong>참고 사이트</strong></h5>
            <CardGroup>
                <Card>
                    <CardImg style={ImageStyle} top width="100%" src={img1} alt="Card image cap" />
                    <br/>
                    <CardBody>
                        <CardTitle>네이버 금융</CardTitle>
                        <CardSubtitle>주식 시세를 볼 수 있는 참고 사이트 입니다.</CardSubtitle>
                        <Button style={ButtonStyle} color="success" outline onClick={naverLink}>
                            네이버 금융 서비스 <Badge color="success">NAVER</Badge>
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardImg style={ImageStyle} top width="100%" src={img2} alt="Card image cap" />
                    <br/>
                    <CardBody>
                        <CardTitle>크레온 API</CardTitle>
                        <CardSubtitle>자동 거래를 할 수 있는 참고 사이트 입니다.</CardSubtitle>
                        <Button style={ButtonStyle} color="primary" outline onClick={creonLink}>
                            온라인 주식 거래 서비스 - 크레온 <Badge color="primary">대신증권</Badge>
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardImg style={ImageStyle} top width="100%" src={img3} alt="Card image cap" />
                    <br/>
                    <CardBody>
                        <CardTitle>야후 파이낸스 API</CardTitle>
                        <CardSubtitle>자동 거래를 할 수 있는 참고 사이트 입니다.</CardSubtitle>
                        <Button style={ButtonStyle} color="danger" outline onClick={yahooLink}>
                            야후 파이낸스 서비스 <Badge color="danger">YAHOO</Badge>
                        </Button>
                    </CardBody>
                </Card>
            </CardGroup>
        </div>
    );
}

export default BackLinkComponent;


