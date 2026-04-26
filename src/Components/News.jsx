import axios from 'axios'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Card from './Card'

const News = () => {
  const [search, setSearch] = useState('politics')
  const [newsData, setNewsData] = useState(null)

  const getData = useCallback(async (query) => {
    const q = query !== undefined ? query : search
    if (!q.trim()) return
    try {
      const res = await axios.get(`/api/news`, { params: { q } })
      let dt = res.data.articles.slice(0, 50)
      setNewsData(dt)
      if (query !== undefined) setSearch(q)
    } catch (err) {
      console.error(err)
    }
  }, [search])

  const isFirstMount = useRef(true)

  // Initial load
  useEffect(() => {
    getData()
  }, [])

  // Responsive search: debounced search as you type (e.g. sports, fitness)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (!search.trim()) return
    const timer = setTimeout(() => getData(), 500)
    return () => clearTimeout(timer)
  }, [search])

  const onSearchSubmit = (e) => {
    e?.preventDefault?.()
    getData()
  }

  const inputclick = (e) => {
    const value = e.target.value
    setSearch(value)
    getData(value)
  }

  const NavLogo = () => (
    <svg className="nav-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  return (
    <div>
      <nav className="nav-bar">
        <div className="nav-brand">
          <NavLogo />
          <h1>Pulse News</h1>
        </div>
        
        <form className="nav-search" onSubmit={onSearchSubmit}>
          <input
            type="text"
            placeholder="Search: sports, fitness, politics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search news"
          />
          <button type="submit">Search</button>
        </form>
      </nav>

      <div className="main-content">
        <div className="buttonslist">
          <h2 className="section-headline">Stay updated with Pulse News.</h2>
          <div className="list">
            <button onClick={inputclick} value="sports">Sports</button>
            <button onClick={inputclick} value="politics">Politics</button>
            <button onClick={inputclick} value="entertainment">Entertainment</button>
            <button onClick={inputclick} value="health">Health</button>
            <button onClick={inputclick} value="fitness">Fitness</button>
          </div>
        </div>
      </div>
     
      <div className="cards-wrapper">
        {newsData ? <Card data={newsData} /> : null}
      </div>
    </div>
  )
}

export default News
