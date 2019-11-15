import React from 'react';
import {Fragment} from "react";
const cheerio = require('cheerio');

class Parser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            data: '',
            isLoading: false,
            header: '',
            text: '',
            imageUrl: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({url: event.target.value});
    }

    handleSubmit(event) {
        fetch('https://cors-anywhere.herokuapp.com/'+this.state.url)
            .then(function(response) {
                return response.text()
            })
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        data: result
                    });
                    const $ = cheerio.load(this.state.data);
                    console.log($('body'));
                    $('script').remove();
                    $('noscript').remove();
                    $('.feature').remove();
                    const header=$('h1.h2').text();
                    const imageUrl=$('.article__body img').attr('data-src');
                    const text=$('.article__body').text();
                    this.setState({
                        header: header,
                        imageUrl: imageUrl,
                        text: text
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
        event.preventDefault();
    }

    render() {
        return (
            <Fragment>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        URL:
                        <input type="text" value={this.state.url} onChange={this.handleChange} />
                    </label>
                    <button type="button" value="Submit" onClick={this.handleSubmit}>Parse</button>
                </form>
                <div className={'container'}>
                    <div className={'row border border-primary'}>
                        <div className={'col-3'}>Header</div>
                        <div className={'col-9'}>{this.state.header}</div>
                    </div>
                    <div className={'row border border-primary'}>
                        <div className={'col-3'}>Image URL</div>
                        <div className={'col-9'}>{this.state.imageUrl}</div>
                    </div>
                    <div className={'row border border-primary'}>
                        <div className={'col-3'}>Text</div>
                        <div className={'col-9'}>{this.state.text}</div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Parser;