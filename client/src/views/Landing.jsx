import { Button, Container, Typography } from '@mui/material'
import './Static.css'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import LandingTopImg from '../assets/landing-top.jpg'
import LandingMidImg from '../assets/landing-mid.jpg'
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined'
import InsightsIcon from '@mui/icons-material/Insights'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import Footer from '../components/Footer'
import Pricing from './Pricing'
import { getResponsiveVarient } from '../helpers/UIHelpers'

function Landing() {
    return (
        <div className="Static">
            <Container maxWidth="lg">
                <div className="StaticTop">
                    <div className="StaticTop-words">
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            color="text.primary"
                            gutterBottom
                        >
                            Empower Your Business with MS365 Pulse Platform
                        </Typography>
                        <Typography variant="h5" color="text.secondary" component="p">
                            Harness the power of MS Graph API and MS 365 data to drive innovation and productivity in
                            your organization.
                        </Typography>
                        <div className="StaticTop-buttons">
                            <Button href="#" variant="contained" sx={{ borderRadius: '40px', px: 3 }}>
                                Get Started
                            </Button>
                            <Button href="#" variant="text" sx={{ borderRadius: '40px', mr: 5, px: 3 }}>
                                Learn more <ArrowRightAltIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="StaticTop-image">
                        <img alt="" src={LandingTopImg} />
                    </div>
                </div>
                <div className="StaticMid">
                    <div className="StaticMid-words">
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Simplify Your Workflow
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            Our platform provides a seamless integration with MS Graph API and MS 365 data, enabling you
                            to focus on what matters - building great applications. customization.
                        </Typography>
                    </div>
                    <div className="StaticMid-content">
                        <div className="StaticMid-image">
                            <img alt="" src={LandingMidImg} />
                        </div>
                        <div className="StaticMid-details">
                            <div className="StaticMid-detailsBox">
                                <div className="StaticMid-detailsBox-icon">
                                    <IntegrationInstructionsOutlinedIcon sx={{ fontSize: '40px' }} />
                                </div>
                                <div className="StaticMid-detailsBox-textContainer">
                                    <div className="StaticMid-detailsBox-textBig">Easy Integration</div>
                                    <div className="StaticMid-detailsBox-textSmall">
                                        Integrate MS Graph API and MS 365 data with ease.
                                    </div>
                                </div>
                            </div>
                            <div className="StaticMid-detailsBox">
                                <div className="StaticMid-detailsBox-icon">
                                    <InsightsIcon sx={{ fontSize: '40px' }} />
                                </div>
                                <div className="StaticMid-detailsBox-textContainer">
                                    <div className="StaticMid-detailsBox-textBig">Automation</div>
                                    <div className="StaticMid-detailsBox-textSmall">
                                        Automate your workflow with our platform.
                                    </div>
                                </div>
                            </div>
                            <div className="StaticMid-detailsBox">
                                <div className="StaticMid-detailsBox-icon">
                                    <AspectRatioOutlinedIcon sx={{ fontSize: '40px' }} />
                                </div>
                                <div className="StaticMid-detailsBox-textContainer">
                                    <div className="StaticMid-detailsBox-textBig">Scalability</div>
                                    <div className="StaticMid-detailsBox-textSmall">
                                        Scale your application with ease.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <Pricing />
            <Footer />
        </div>
    )
}

export default Landing
