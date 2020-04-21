import React from 'react'
import KakaoMap from './component/KakaoMap'
import Dailog from './component/Main_dialog'
import Nav from './component/Nav'
import './App.css'
import './component/List.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Nav />
        <KakaoMap />
        <Dailog />
      </header>
    </div>
  )
}

export default App
