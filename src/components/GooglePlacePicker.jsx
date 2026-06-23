import { useEffect, useRef, useState } from 'react'

let mapsPromise
function loadMaps(key) {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    const callback = `initDiaghubMaps_${Date.now()}`
    window[callback] = () => { delete window[callback]; resolve(window.google.maps) }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&libraries=places&callback=${callback}`
    script.async = true
    script.onerror = () => reject(new Error('Google Maps could not load'))
    document.head.appendChild(script)
  })
  return mapsPromise
}

export default function GooglePlacePicker({ value, address, onSelect }) {
  const mount = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [error, setError] = useState('')
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!key || !mount.current) return
    let element
    let active = true
    loadMaps(key).then(async maps => {
      const { PlaceAutocompleteElement } = await maps.importLibrary('places')
      if (!active) return
      element = new PlaceAutocompleteElement({ includedRegionCodes: ['in'] })
      element.setAttribute('aria-label', 'Search shop on Google Maps')
      mount.current.replaceChildren(element)
      element.addEventListener('gmp-select', async event => {
        const place = event.placePrediction.toPlace()
        await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location'] })
        onSelectRef.current({ placeId: place.id, address: place.formattedAddress || place.displayName, latitude: place.location?.lat(), longitude: place.location?.lng() })
      })
    }).catch(err => setError(err.message))
    return () => { active = false; element?.remove() }
  }, [key])

  if (!key) return <label>Google Maps place ID<input aria-label="Google Maps place ID" required value={value} onChange={event => onSelect({ placeId: event.target.value, address })} placeholder="Add VITE_GOOGLE_MAPS_API_KEY to enable search"/></label>
  return <div className="place-picker"><label>Find your shop on Google Maps</label><div ref={mount} className="place-autocomplete"></div>{value && <small>✓ Location selected: {address}</small>}{error && <small className="form-error">{error}</small>}</div>
}
