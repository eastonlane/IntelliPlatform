-- Custom SQL migration file, put your code below! --
SELECT create_hypertable('metrics', by_range('time'));