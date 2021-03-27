import Portfolio from './Portfolio'
import { getLandingImage } from '../util/hash'

// We only do this once on page load, so do it outside the component
const landingImage = getLandingImage()

function App() {
  return (
    <div className="App">
      <Portfolio landingImage={landingImage} />
    </div>
  );
}

export default App;
