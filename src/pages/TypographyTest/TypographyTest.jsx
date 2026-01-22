import React from 'react'
import './TypographyTest.css'
import '../../tokens/typography.css'

const TypographyTest = () => {
  const styles = [
    // TT Norms 600 (DemiBold) - Primary
    { class: 'text-ttn-600-7xl', label: 'TT Norms 600 / 7XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-6xl', label: 'TT Norms 600 / 6XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-5xl', label: 'TT Norms 600 / 5XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-4xl', label: 'TT Norms 600 / 4XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-3xl', label: 'TT Norms 600 / 3XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-2xl', label: 'TT Norms 600 / 2XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-xl', label: 'TT Norms 600 / XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-l', label: 'TT Norms 600 / L', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-m', label: 'TT Norms 600 / M', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-s', label: 'TT Norms 600 / S', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-xs', label: 'TT Norms 600 / XS', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-600-xxs', label: 'TT Norms 600 / XXS', text: 'The quick brown fox jumps over the lazy dog' },
    
    // TT Norms 500 (Medium) - Primary
    { class: 'text-ttn-500-7xl', label: 'TT Norms 500 / 7XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-6xl', label: 'TT Norms 500 / 6XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-5xl', label: 'TT Norms 500 / 5XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-4xl', label: 'TT Norms 500 / 4XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-3xl', label: 'TT Norms 500 / 3XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-2xl', label: 'TT Norms 500 / 2XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xl', label: 'TT Norms 500 / XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-l', label: 'TT Norms 500 / L', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-m', label: 'TT Norms 500 / M', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-s', label: 'TT Norms 500 / S', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xs', label: 'TT Norms 500 / XS', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xxs', label: 'TT Norms 500 / XXS', text: 'The quick brown fox jumps over the lazy dog' },
    
    // TT Norms 400 (Regular) - Primary
    { class: 'text-ttn-400-7xl', label: 'TT Norms 400 / 7XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-6xl', label: 'TT Norms 400 / 6XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-5xl', label: 'TT Norms 400 / 5XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-4xl', label: 'TT Norms 400 / 4XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-3xl', label: 'TT Norms 400 / 3XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-2xl', label: 'TT Norms 400 / 2XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-xl', label: 'TT Norms 400 / XL', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-l', label: 'TT Norms 400 / L', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-m', label: 'TT Norms 400 / M', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-s', label: 'TT Norms 400 / S', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-xs', label: 'TT Norms 400 / XS', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-400-xxs', label: 'TT Norms 400 / XXS', text: 'The quick brown fox jumps over the lazy dog' },
    
    // TT Norms 500 (Medium) - Secondary
    { class: 'text-ttn-500-7xl-secondary', label: 'TT Norms 500 / 7XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-6xl-secondary', label: 'TT Norms 500 / 6XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-5xl-secondary', label: 'TT Norms 500 / 5XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-4xl-secondary', label: 'TT Norms 500 / 4XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-3xl-secondary', label: 'TT Norms 500 / 3XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-2xl-secondary', label: 'TT Norms 500 / 2XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xl-secondary', label: 'TT Norms 500 / XL (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-l-secondary', label: 'TT Norms 500 / L (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-m-secondary', label: 'TT Norms 500 / M (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-s-secondary', label: 'TT Norms 500 / S (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xs-secondary', label: 'TT Norms 500 / XS (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
    { class: 'text-ttn-500-xxs-secondary', label: 'TT Norms 500 / XXS (Secondary)', text: 'The quick brown fox jumps over the lazy dog' },
  ]

  return (
    <div className="typography-test">
      <div className="typography-test-header">
        <h1>Typography Test - All 48 Styles</h1>
        <p>Testing TT Norms Tochka Extended font family</p>
      </div>

      <div className="typography-test-content">
        {styles.length > 0 ? (
          styles.map((style, index) => (
            <div key={index} className="typography-test-item">
              <div className="typography-test-label">{style.label}</div>
              <div className={`typography-test-text ${style.class}`}>
                {style.text}
              </div>
              <div className="typography-test-class">.{style.class}</div>
            </div>
          ))
        ) : (
          <div>No styles found</div>
        )}
      </div>
    </div>
  )
}

export default TypographyTest
