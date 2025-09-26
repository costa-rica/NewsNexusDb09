import { sequelize } from "./_connection";

import { initArticle, Article } from "./Article";
import { initArticleApproved, ArticleApproved } from "./ArticleApproved";
import { initArticleContent, ArticleContent } from "./ArticleContent";
import {
	initArticleEntityWhoCategorizedArticleContract,
	ArticleEntityWhoCategorizedArticleContract,
} from "./ArticleEntityWhoCategorizedArticleContract";
import { initArticleIsRelevant, ArticleIsRelevant } from "./ArticleIsRelevant";
import {
	initArticleKeywordContract,
	ArticleKeywordContract,
} from "./ArticleKeywordContract";
import {
	initArticleReportContract,
	ArticleReportContract,
} from "./ArticleReportContract";
import { initArticleReviewed, ArticleReviewed } from "./ArticleReviewed";
import {
	initArticleStateContract,
	ArticleStateContract,
} from "./ArticleStateContract";
import {
	initArtificialIntelligence,
	ArtificialIntelligence,
} from "./ArtificialIntelligence";
import {
	initEntityWhoCategorizedArticle,
	EntityWhoCategorizedArticle,
} from "./EntityWhoCategorizedArticle";
import {
	initEntityWhoFoundArticle,
	EntityWhoFoundArticle,
} from "./EntityWhoFoundArticle";
import { initKeyword, Keyword } from "./Keyword";
import { initNewsApiRequest, NewsApiRequest } from "./NewsApiRequest";
import {
	initNewsApiRequestWebsiteDomainContract,
	NewsApiRequestWebsiteDomainContract,
} from "./NewsApiRequestWebsiteDomainContract";
import {
	initNewsArticleAggregatorSource,
	NewsArticleAggregatorSource,
} from "./NewsArticleAggregatorSource";
import {
	initNewsArticleAggregatorSourceStateContract,
	NewsArticleAggregatorSourceStateContract,
} from "./NewsArticleAggregatorSourceStateContract";
import { initNewsRssRequest, NewsRssRequest } from "./NewsRssRequest";
import { initReport, Report } from "./Report";
import { initState, State } from "./State";
import { initUser, User } from "./User";
import { initWebsiteDomain, WebsiteDomain } from "./WebsiteDomain";

import { applyAssociations } from "./_associations";

export function initModels() {
	initArticle();
	initArticleApproved();
	initArticleContent();
	initArticleEntityWhoCategorizedArticleContract();
	initArticleIsRelevant();
	initArticleKeywordContract();
	initArticleReportContract();
	initArticleReviewed();
	initArticleStateContract();
	initArtificialIntelligence();
	initEntityWhoCategorizedArticle();
	initEntityWhoFoundArticle();
	initKeyword();
	initNewsApiRequest();
	initNewsApiRequestWebsiteDomainContract();
	initNewsArticleAggregatorSource();
	initNewsArticleAggregatorSourceStateContract();
	initNewsRssRequest();
	initReport();
	initState();
	initUser();
	initWebsiteDomain();

	applyAssociations();

	return {
		sequelize,
		Article,
		ArticleApproved,
		ArticleContent,
		ArticleEntityWhoCategorizedArticleContract,
		ArticleIsRelevant,
		ArticleKeywordContract,
		ArticleReportContract,
		ArticleReviewed,
		ArticleStateContract,
		ArtificialIntelligence,
		EntityWhoCategorizedArticle,
		EntityWhoFoundArticle,
		Keyword,
		NewsApiRequest,
		NewsApiRequestWebsiteDomainContract,
		NewsArticleAggregatorSource,
		NewsArticleAggregatorSourceStateContract,
		NewsRssRequest,
		Report,
		State,
		User,
		WebsiteDomain,
	};
}

export {
	sequelize,
	Article,
	ArticleApproved,
	ArticleContent,
	ArticleEntityWhoCategorizedArticleContract,
	ArticleIsRelevant,
	ArticleKeywordContract,
	ArticleReportContract,
	ArticleReviewed,
	ArticleStateContract,
	ArtificialIntelligence,
	EntityWhoCategorizedArticle,
	EntityWhoFoundArticle,
	Keyword,
	NewsApiRequest,
	NewsApiRequestWebsiteDomainContract,
	NewsArticleAggregatorSource,
	NewsArticleAggregatorSourceStateContract,
	NewsRssRequest,
	Report,
	State,
	User,
	WebsiteDomain,
};
