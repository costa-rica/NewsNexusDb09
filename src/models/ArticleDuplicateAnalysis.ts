import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './_connection';

interface ArticleDuplicateAnalysisAttributes {
  id: number;
  articleIdNew: number;
  articleIdApproved: number;
  sameArticleIdFlag: number;
  articleNewState: string;
  articleApprovedState: string;
  sameStateFlag: number;
  urlCheck: number;
  contentHash: number;
  embeddingSearch: number;
}

interface ArticleDuplicateAnalysisCreationAttributes extends Optional<ArticleDuplicateAnalysisAttributes, 'id'> {}

export class ArticleDuplicateAnalysis extends Model<ArticleDuplicateAnalysisAttributes, ArticleDuplicateAnalysisCreationAttributes> implements ArticleDuplicateAnalysisAttributes {
  public id!: number;
  public articleIdNew!: number;
  public articleIdApproved!: number;
  public sameArticleIdFlag!: number;
  public articleNewState!: string;
  public articleApprovedState!: string;
  public sameStateFlag!: number;
  public urlCheck!: number;
  public contentHash!: number;
  public embeddingSearch!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initArticleDuplicateAnalysis() {
  ArticleDuplicateAnalysis.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      articleIdNew: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      articleIdApproved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sameArticleIdFlag: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      articleNewState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      articleApprovedState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sameStateFlag: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      urlCheck: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contentHash: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      embeddingSearch: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ArticleDuplicateAnalysis',
      tableName: 'ArticleDuplicateAnalyses',
      timestamps: true,
    }
  );
  return ArticleDuplicateAnalysis;
}

export default ArticleDuplicateAnalysis;