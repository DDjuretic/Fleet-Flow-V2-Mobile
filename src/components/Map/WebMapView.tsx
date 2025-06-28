import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Dimensions, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { LocationCoordinates } from '../../services/locationService';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface WebMapViewProps {
  style?: any;
  showUserLocation?: boolean;
  centerCoordinate?: [number, number]; // [longitude, latitude]
  zoomLevel?: number;
  route?: LocationCoordinates[];
  markers?: Array<{
    id: string;
    coordinate: [number, number];
    title?: string;
    description?: string;
    type?: 'poi' | 'vehicle' | 'custom';
  }>;
  onMapPress?: (coordinate: [number, number]) => void;
  onUserLocationUpdate?: (location: LocationCoordinates) => void;
  // New props for navigation mode
  navigationMode?: boolean;
  followUserLocation?: boolean;
  showNavigationControls?: boolean;
  // Advanced features
  poiMarkers?: Array<{
    id: string;
    coordinate: [number, number];
    title: string;
    description?: string;
    category?: string;
  }>;
  geofenceZones?: Array<{
    id: string;
    coordinates: [number, number][];
    name: string;
    color?: string;
  }>;
  // Map layer options
  mapLayer?: 'standard' | 'satellite' | 'terrain' | 'hybrid';
  showLayerControls?: boolean;
}

const WebMapView: React.FC<WebMapViewProps> = ({
  style,
  showUserLocation = true,
  centerCoordinate,
  zoomLevel = 10,
  route = [],
  markers = [],
  onMapPress,
  onUserLocationUpdate,
  navigationMode = false,
  followUserLocation = false,
  showNavigationControls = true,
  poiMarkers = [],
  geofenceZones = [],
  mapLayer = 'standard',
  showLayerControls = true,
}) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const webViewRef = useRef<WebView>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(followUserLocation);
  const [currentUserLocation, setCurrentUserLocation] = useState<LocationCoordinates | null>(null);
  const [currentMapLayer, setCurrentMapLayer] = useState<'standard' | 'satellite' | 'terrain' | 'hybrid'>(mapLayer);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
  };

  // Default coordinates (Belgrade, Serbia)
  const defaultLat = centerCoordinate ? centerCoordinate[1] : 44.7866;
  const defaultLng = centerCoordinate ? centerCoordinate[0] : 20.4489;
  const defaultZoom = navigationMode ? 16 : zoomLevel; // Higher zoom for navigation mode

  // Map layer configurations
  const mapLayerConfigs = {
    standard: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri, Maxar, Earthstar Geographics'
    },
    terrain: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
      attribution: '© Stamen Design, © OpenStreetMap contributors'
    },
    hybrid: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri, Maxar, Earthstar Geographics'
    }
  };

  // Generate HTML for the map
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .layer-control {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: ${screenColors.card};
                border-radius: 8px;
          padding: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
        .layer-button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          margin: 2px 0;
          background: ${screenColors.background};
          color: ${screenColors.text};
          border: 1px solid ${screenColors.border};
          border-radius: 4px;
                cursor: pointer;
          text-align: center;
          font-size: 12px;
        }
        .layer-button.active {
          background: #007AFF;
          color: white;
          border-color: #007AFF;
            }
        .layer-button:hover {
          opacity: 0.8;
            }
            .start-end-marker {
                background-color: white;
                border: 2px solid #333;
                border-radius: 50%;
                font-weight: bold;
                font-size: 14px;
                text-align: center;
                line-height: 26px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            .start-marker {
          background-color: #4CAF50;
                color: white;
                border-color: white;
            }
            .end-marker {
          background-color: #F44336;
                color: white;
                border-color: white;
            }
            .poi-marker {
          background-color: #2196F3;
                color: white;
                border: 2px solid white;
                border-radius: 50%;
                font-weight: bold;
                font-size: 12px;
                text-align: center;
                line-height: 22px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            .user-location-marker {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
          background-color: ${screenColors.primary};
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            }
            .navigation-marker {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 4px solid white;
          background-color: ${screenColors.primary};
                box-shadow: 0 0 15px rgba(0,0,0,0.5);
                position: relative;
            }
            .navigation-marker::after {
                content: '';
                position: absolute;
                top: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 12px solid ${screenColors.primary};
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
      ${showLayerControls ? `
      <div class="layer-control">
        <button class="layer-button ${currentMapLayer === 'standard' ? 'active' : ''}" onclick="changeLayer('standard')">Standard</button>
        <button class="layer-button ${currentMapLayer === 'satellite' ? 'active' : ''}" onclick="changeLayer('satellite')">Satellite</button>
        <button class="layer-button ${currentMapLayer === 'terrain' ? 'active' : ''}" onclick="changeLayer('terrain')">Terrain</button>
        <button class="layer-button ${currentMapLayer === 'hybrid' ? 'active' : ''}" onclick="changeLayer('hybrid')">Hybrid</button>
      </div>
      ` : ''}
      
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
        let map;
        let currentTileLayer;
        let userLocationMarker;
        let routePolyline;
        let markers = [];
        
        const layerConfigs = {
          standard: {
            url: '${mapLayerConfigs.standard.url}',
            attribution: '${mapLayerConfigs.standard.attribution}'
          },
          satellite: {
            url: '${mapLayerConfigs.satellite.url}',
            attribution: '${mapLayerConfigs.satellite.attribution}'
          },
          terrain: {
            url: '${mapLayerConfigs.terrain.url}',
            attribution: '${mapLayerConfigs.terrain.attribution}'
          },
          hybrid: {
            url: '${mapLayerConfigs.hybrid.url}',
            attribution: '${mapLayerConfigs.hybrid.attribution}'
          }
        };
        
        function initMap() {
          map = L.map('map').setView([${defaultLat}, ${defaultLng}], ${defaultZoom});
                
          // Add initial tile layer
          const currentConfig = layerConfigs['${currentMapLayer}'];
          currentTileLayer = L.tileLayer(currentConfig.url, {
            attribution: currentConfig.attribution,
            maxZoom: 19
          }).addTo(map);
          
          // Add map click handler
          map.on('click', function(e) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'mapPress',
              coordinate: [e.latlng.lng, e.latlng.lat]
            }));
          });
        }
        
        function changeLayer(layerType) {
          const config = layerConfigs[layerType];
          if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
          }
          
          currentTileLayer = L.tileLayer(config.url, {
            attribution: config.attribution,
            maxZoom: 19
          }).addTo(map);
          
          // Update button states
          document.querySelectorAll('.layer-button').forEach(btn => {
            btn.classList.remove('active');
          });
          document.querySelector(\`[onclick="changeLayer('\${layerType}')"]\`).classList.add('active');
          
          // Notify React Native
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'layerChanged',
            layer: layerType
          }));
        }

                // --- MAP CONTROLS ---
                var CustomControl = L.Control.extend({
                    options: {
                        position: 'bottomright'
                    },
                    onAdd: function(map) {
                        var container = L.DomUtil.create('div', 'leaflet-control');
                        container.style.border = 'none';
                        container.style.backgroundColor = 'transparent';
                        container.style.display = 'flex';
                        container.style.flexDirection = 'column';
                        container.style.gap = '10px';

                        // --- Zoom Group ---
                        var zoomGroup = L.DomUtil.create('div', 'custom-control-group', container);
                        var zoomInButton = L.DomUtil.create('a', 'custom-control-button', zoomGroup);
                        zoomInButton.innerHTML = '+';
                        zoomInButton.href = '#';
                        L.DomEvent.on(zoomInButton, 'click', function(e) {
                            map.zoomIn();
                            L.DomEvent.stop(e);
                        });

                        var zoomOutButton = L.DomUtil.create('a', 'custom-control-button', zoomGroup);
                        zoomOutButton.innerHTML = '-';
                        zoomOutButton.href = '#';
                        L.DomEvent.on(zoomOutButton, 'click', function(e) {
                            map.zoomOut();
                            L.DomEvent.stop(e);
                        });

                        // --- Navigation Group (only in navigation mode) ---
                        if (${navigationMode}) {
                            var navGroup = L.DomUtil.create('div', 'custom-control-group', container);
                            
                            // Fit to Route button
                            var fitRouteButton = L.DomUtil.create('a', 'custom-control-button', navGroup);
                            fitRouteButton.innerHTML = '🗺️';
                            fitRouteButton.href = '#';
                            fitRouteButton.title = 'Fit route to view';
                            L.DomEvent.on(fitRouteButton, 'click', function(e) {
                                fitRouteBounds();
                                L.DomEvent.stop(e);
                            });
                            
                            var centerButton = L.DomUtil.create('a', 'custom-control-button', navGroup);
                            centerButton.innerHTML = '🎯';
                            centerButton.href = '#';
                            centerButton.title = 'Center on my location';
                            L.DomEvent.on(centerButton, 'click', function(e) {
                                centerOnUser();
                                L.DomEvent.stop(e);
                            });

                            var followButton = L.DomUtil.create('a', 'custom-control-button', navGroup);
                            followButton.innerHTML = '👣';
                            followButton.href = '#';
                            followButton.title = 'Follow my location';
                            followButton.id = 'followButton';
                            L.DomEvent.on(followButton, 'click', function(e) {
                                toggleFollowUser();
                                L.DomEvent.stop(e);
                            });
                        }
                        
                        L.DomEvent.disableClickPropagation(container);
                        return container;
                    }
                });
                map.addControl(new CustomControl());

                // --- ROUTE AND MARKERS ---
        let routeCoordinates = ${JSON.stringify(route.map(point => `[${point.latitude}, ${point.longitude}]`).join(',\n'))};
                let routePolyline = null;

        if (routeCoordinates.length > 1) {
          routePolyline = L.polyline(routeCoordinates, { color: '${screenColors.primary}', weight: 6, opacity: 0.8 }).addTo(map);

                    // Start marker
          L.marker(routeCoordinates[0], { 
                icon: L.divIcon({
                            className: 'start-end-marker start-marker',
              html: 'S',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
                        }) 
          }).addTo(map).bindPopup('Start');
                    
                    // End marker
          L.marker(routeCoordinates[routeCoordinates.length - 1], {
                icon: L.divIcon({
                            className: 'start-end-marker end-marker',
              html: 'E',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
                        }) 
          }).addTo(map).bindPopup('End');
                    
                    // Auto-fit route on load
                    setTimeout(function() {
                        fitRouteBounds();
                    }, 1000);
                }

                // --- ADDITIONAL MARKERS (POI, etc.) ---
        let additionalMarkers = ${JSON.stringify(markers.map(marker => ({
          lat: marker.coordinate[1],
          lng: marker.coordinate[0],
          title: marker.title || '',
          description: marker.description || '',
          type: marker.type || 'custom'
        })))};
                additionalMarkers.forEach(function(marker) {
                    L.marker([marker.lat, marker.lng], {
                        icon: L.divIcon({
                            className: 'poi-marker',
              html: marker.type === 'poi' ? 'P' : 'M',
              iconSize: [26, 26],
              iconAnchor: [13, 13]
                        })
          }).addTo(map).bindPopup(marker.title + (marker.description ? '<br>' + marker.description : ''));
                });

                // --- USER LOCATION TRACKING ---
                let isFollowing = ${followUserLocation};
                let watchId = null;

                // Function to fit map to route bounds
                function fitRouteBounds() {
                    if (routePolyline) {
                        map.fitBounds(routePolyline.getBounds().pad(0.1));
                    }
                }

                // Function to center on user location
                function centerOnUser() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            map.setView([lat, lng], 16);
                            
                            // Send location update to React Native
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'locationUpdate',
                                data: {
                                    latitude: lat,
                                    longitude: lng,
                                    timestamp: Date.now(),
                                    heading: position.coords.heading || 0
                                }
                            }));
                }, function(error) {
                            console.error('Error getting location:', error);
                }, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            }
                }

                // Function to toggle follow user mode
                function toggleFollowUser() {
                    isFollowing = !isFollowing;
                    const followButton = document.getElementById('followButton');
                    
                    if (isFollowing) {
                        followButton.style.backgroundColor = '${screenColors.primary}';
                        followButton.style.color = 'white';
                        startLocationTracking();
                    } else {
                        followButton.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        followButton.style.color = '#333';
                        stopLocationTracking();
                    }
                    
                    // Send follow state to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'followUserToggled',
                        data: { isFollowing: isFollowing }
                    }));
                }

                // Start location tracking
                function startLocationTracking() {
          if (navigator.geolocation && ${showUserLocation}) {
            watchId = navigator.geolocation.watchPosition(
              function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            
                            if (userLocationMarker) {
                  map.removeLayer(userLocationMarker);
                }
                
                                userLocationMarker = L.marker([lat, lng], {
                                    icon: L.divIcon({
                    className: '${navigationMode ? 'navigation-marker' : 'user-location-marker'}',
                    html: '',
                    iconSize: [${navigationMode ? '24' : '20'}, ${navigationMode ? '24' : '20'}],
                    iconAnchor: [${navigationMode ? '12' : '10'}, ${navigationMode ? '12' : '10'}]
                                    })
                                }).addTo(map);
                            
                            if (isFollowing) {
                  map.setView([lat, lng], ${navigationMode ? '17' : '15'});
                            }
                            
                // Notify React Native
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                  type: 'userLocationUpdate',
                  location: { latitude: lat, longitude: lng }
                            }));
              },
              function(error) {
                console.error('Geolocation error:', error);
              },
              {
                            enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
              }
            );
                    }
                }

                // Stop location tracking
                function stopLocationTracking() {
                    if (watchId) {
                        navigator.geolocation.clearWatch(watchId);
                        watchId = null;
                    }
                }

                // Start tracking if showUserLocation is enabled
                if (${showUserLocation}) {
                    startLocationTracking();
                }

                // Send map loaded message
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapLoaded'
            }));
                
            } catch(e) {
                console.error('Map initialization error:', e);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapError',
                    data: { error: e.message }
                }));
            }
        </script>
    </body>
    </html>
    `;

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      switch (message.type) {
        case 'mapPress':
          if (onMapPress) {
            onMapPress(message.coordinate);
          }
          break;
          
        case 'userLocationUpdate':
          if (onUserLocationUpdate) {
            onUserLocationUpdate(message.location);
          }
          break;
          
        case 'layerChanged':
          setCurrentMapLayer(message.layer);
          console.log('🗺️ Map layer changed to:', message.layer);
          break;
          
        default:
          console.log('Unknown WebView message:', message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // Center map on coordinate
  const centerOnCoordinate = (coordinate: [number, number], zoom?: number) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        map.setView([${coordinate[1]}, ${coordinate[0]}], ${zoom || defaultZoom});
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Fit map to route
  const fitToRoute = () => {
    if (webViewRef.current && mapLoaded && route.length > 1) {
      const script = `
        if (typeof fitRouteBounds !== 'undefined') {
          fitRouteBounds();
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Center on user location
  const centerOnUserLocation = () => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        if (typeof centerOnUser !== 'undefined') {
          centerOnUser();
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Toggle follow user mode
  const toggleFollowUser = () => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        if (typeof toggleFollowUser !== 'undefined') {
          toggleFollowUser();
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Zoom in
  const zoomIn = () => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        map.zoomIn();
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Zoom out
  const zoomOut = () => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        map.zoomOut();
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Effect to center map when coordinate changes
  useEffect(() => {
    if (mapLoaded && centerCoordinate) {
      setTimeout(() => centerOnCoordinate(centerCoordinate), 500);
    }
  }, [centerCoordinate, mapLoaded]);

  // Effect to fit route when route changes
  useEffect(() => {
    if (mapLoaded && route.length > 1) {
      setTimeout(() => fitToRoute(), 500);
    }
  }, [route, mapLoaded]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    gap: 10,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomControls: {
    flexDirection: 'column',
    gap: 2,
  },
  locationControls: {
    flexDirection: 'column',
    gap: 2,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default WebMapView; 