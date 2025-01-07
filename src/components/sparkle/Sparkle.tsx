import { useEffect } from 'react'
import './Sparkle.css'

const Sparkle = ({ x, y, clickPoints } : any) => {
	useEffect(() => {
		const sparkleElement = document.createElement('div')
		sparkleElement.classList.add('sparkle');
		sparkleElement.innerText = `+${clickPoints}`;
		sparkleElement.style.left = `${x}px`
		sparkleElement.style.top = `${y}px`

		document.body.appendChild(sparkleElement)

		setTimeout(() => {
			sparkleElement.remove()
		}, 1000) // Duration of the sparkle animation

		return () => {
			sparkleElement.remove()
		}
	}, [x, y])

	return null
}

export default Sparkle
