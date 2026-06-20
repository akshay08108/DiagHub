import { useEffect, useRef, useState } from 'react'

let mapsPromise
export function loadMaps(key) {
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

export async function resolvePincode(pincode) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!key) throw new Error('Google Maps is not configured')
  const maps = await loadMaps(key)
  const geocoder = new maps.Geocoder()
  const response = await geocoder.geocode({ address: `${pincode}, India`, region: 'IN' })
  const result = response.results?.[0]
  if (!result) throw new Error('We could not find that pincode')
  return {
    label: result.formatted_address,
    latitude: result.geometry.location.lat(),
    longitude: result.geometry.location.lng(),
  }
}

export default function GooglePlacePicker({ value, address, onSelect }) {
  const mount = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
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

  async function useDeviceLocation() {
    if (!navigator.geolocation) { setError('Location services are not supported on this device'); return }
    if (!key) { setError('Google Maps is not configured'); return }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(async position => {
      const location = { lat: position.coords.latitude, lng: position.coords.longitude }
      const fallbackPlace = {
        placeId: `device-${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`,
        address: `Current location (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`,
        latitude: location.lat,
        longitude: location.lng,
      }
      onSelectRef.current(fallbackPlace)
      try {
        const maps = await loadMaps(key)
        const geocoder = new maps.Geocoder()
        const response = await geocoder.geocode({ location })
        const result = response.results?.[0]
        const pincode = result?.address_components?.find(component => component.types.includes('postal_code'))?.long_name || ''
        onSelectRef.current({
          placeId: result?.place_id || fallbackPlace.placeId,
          address: result?.formatted_address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
          latitude: location.lat,
          longitude: location.lng,
          ...(pincode ? { pincode } : {}),
        })
      } catch { setError('Location captured. Google could not convert it to an address, so please also enter the shop address.') }
      finally { setLocating(false) }
    }, err => {
      setLocating(false)
      setError(err.code === 1 ? 'Location permission was denied. Allow location access and try again.' : 'Could not read your current location.')
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 })
  }

  if (!key) return <label>Google Maps place ID<input aria-label="Google Maps place ID" required value={value} onChange={event => onSelect({ placeId: event.target.value, address })} placeholder="Add VITE_GOOGLE_MAPS_API_KEY to enable search"/></label>
  return <div className="place-picker"><label>Shop location</label><button className="location-service-button" type="button" onClick={useDeviceLocation} disabled={locating}>{locating ? 'Finding your location…' : '⌖ Use my current location'}</button><span className="location-or">or search on Google Maps</span><div ref={mount} className="place-autocomplete"></div>{value && <small>✓ Location selected: {address}</small>}{error && <small className="form-error">{error}</small>}</div>
}
