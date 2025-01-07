import ReactPixel from 'react-facebook-pixel'

const pixelId = '1868669336971198' // Replace with your actual Pixel ID

export const initFacebookPixel = () => {
	ReactPixel.init(pixelId)
	ReactPixel.pageView() // For tracking page views
}

export const trackCustomEvent = (event: any, data: any) => {
	ReactPixel.track(event, data)
}
