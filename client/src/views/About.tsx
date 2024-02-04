import { Button, Container, Typography, Box } from '@mui/material'
import './Static.css'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import WhyChooseUs from '../assets/whyChooseUs.jpg'
import ExpertiseImg from '../assets/expertise.jpg'
import outStoryImg from '../assets/outStory.jpg'
import Footer from '../components/Footer'
import { getResponsiveVarient } from '../helpers/UIHelpers'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'

function About() {
    return (
        <div className="Static">
            <Container maxWidth="lg">
                <div className="StaticMid">
                    <div className="Static-image">
                        <img alt="" src={outStoryImg} style={{ maxWidth: '800px' }} />
                    </div>
                    <Box className="StaticMid-words">
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="left"
                            color="text.primary"
                            gutterBottom
                        >
                            Our Story
                        </Typography>
                        <Typography
                            variant="h5"
                            align="left"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            At MS365 Pulse Platform, we began with a vision to revolutionize how businesses interact
                            with data. Founded by a team of passionate innovators and data enthusiasts, we identified a
                            gap in the market for a tool that could harness the full potential of MS Graph API and MS
                            365 data. Our journey started with the goal of simplifying complex data integration and
                            making it more accessible for businesses of all sizes.
                        </Typography>
                    </Box>
                    <Box className="StaticMid-words" sx={{ my: 10 }}>
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="right"
                            color="text.primary"
                            gutterBottom
                        >
                            Our Mission
                        </Typography>
                        <Typography
                            variant="h5"
                            align="right"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            Our mission is simple but powerful: to empower organizations by providing the most
                            intuitive, seamless, and powerful platform for integrating MS Graph API and MS 365 data. We
                            believe that by breaking down the barriers of complex data processes, we can help businesses
                            focus on what they do best - innovate and grow.
                        </Typography>
                    </Box>
                    <Box className="StaticMid-words" sx={{ my: 10 }}>
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="left"
                            color="text.primary"
                            gutterBottom
                        >
                            What We Do
                        </Typography>
                        <Typography
                            variant="h5"
                            align="left"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            MS365 Pulse Platform is more than just a data integration tool; it's a complete solution
                            that caters to various business needs. From simplifying workflows to automating mundane
                            tasks, our platform is designed to enhance productivity and scalability. We provide a robust
                            yet user-friendly platform that integrates seamlessly with MS Graph API and MS 365, allowing
                            businesses to leverage their data like never before.
                        </Typography>
                    </Box>
                    <div className="StaticTop">
                        <div className="StaticTop-words">
                            <Typography
                                component="h1"
                                variant={getResponsiveVarient('h2')}
                                color="text.primary"
                                gutterBottom
                                sx={{ maxWidth: '300px' }}
                            >
                                Why Choose Us
                            </Typography>
                            <Typography variant="h5" color="text.secondary" component="p">
                                Choosing MS365 Pulse Platform means choosing a partner committed to your success. We
                                stand out in the market for our.
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
                            <img alt="" src={WhyChooseUs} />
                        </div>
                    </div>
                    <Box className="StaticMid-words" sx={{ my: 10 }}>
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Our Approach
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            Our approach is centered around three core principles: simplicity, efficiency, and
                            scalability. We understand the challenges businesses face in managing vast amounts of data,
                            which is why we've designed our platform to be as straightforward and adaptable as possible.
                            Whether you're a small startup or a large enterprise, our platform is built to scale with
                            your needs.
                        </Typography>
                    </Box>
                    <Box className="StaticMid-words" sx={{ my: 10, mt: 20 }}>
                        <Typography
                            component="h1"
                            variant={getResponsiveVarient('h2')}
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Join Us
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            component="p"
                            sx={{ maxWidth: '800px' }}
                        >
                            Partner with us and take the first step towards transforming your business with the power of
                            MS365 Pulse Platform. Experience a new era of innovation and productivity.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
                            <Button href="#" variant="contained" sx={{ borderRadius: '40px', px: 3 }}>
                                Get Started
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Container>
            <Footer />
        </div>
    )
}

export default About
